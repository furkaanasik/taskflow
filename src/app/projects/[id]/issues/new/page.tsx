'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Project {
  id: string
  name: string
  key: string
  members: {
    userId: string
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}

const typeOptions = [
  { value: 'TASK', label: 'Görev', icon: '📝', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'BUG', label: 'Hata', icon: '🐛', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'STORY', label: 'Hikaye', icon: '📖', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'EPIC', label: 'Epic', icon: '🚀', color: 'bg-purple-100 text-purple-800 border-purple-200' },
]

const priorityOptions = [
  { value: 'LOWEST', label: 'En Düşük', color: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-400' },
  { value: 'LOW', label: 'Düşük', color: 'bg-green-100 text-green-800 border-green-200', dot: 'bg-green-400' },
  { value: 'MEDIUM', label: 'Orta', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-400' },
  { value: 'HIGH', label: 'Yüksek', color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-400' },
  { value: 'HIGHEST', label: 'En Yüksek', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-400' },
]

export default function NewIssuePage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('TASK')
  const [priority, setPriority] = useState('MEDIUM')
  const [assigneeId, setAssigneeId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast.error('Proje bulunamadı')
        router.push('/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Proje yüklenirken hata oluştu')
    } finally {
      setIsLoadingProject(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Görev başlığı zorunludur')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/projects/${params.id}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          type,
          priority,
          assigneeId: assigneeId || null,
        }),
      })
      
      if (response.ok) {
        toast.success('🎉 Görev başarıyla oluşturuldu!')
        router.push(`/projects/${params.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Görev oluşturulurken hata oluştu')
      }
    } catch (error) {
      console.error('Create issue error:', error)
      toast.error('Görev oluşturulurken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeConfig = (value: string) => {
    return typeOptions.find(option => option.value === value) || typeOptions[0]
  }

  const getPriorityConfig = (value: string) => {
    return priorityOptions.find(option => option.value === value) || priorityOptions[2]
  }

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-slate-600 font-medium">Proje yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Proje Bulunamadı</h3>
              <p className="text-slate-600">Aradığınız proje mevcut değil veya erişim yetkiniz bulunmuyor.</p>
              <Button asChild>
                <Link href="/projects">Projelere Dön</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const selectedType = getTypeConfig(type)
  const selectedPriority = getPriorityConfig(priority)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/projects" className="hover:text-blue-600 transition-colors duration-200">Projeler</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/projects/${project.id}`} className="hover:text-blue-600 transition-colors duration-200">
            {project.name}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 font-medium">Yeni Görev</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Yeni Görev Oluştur
                </h1>
                <p className="text-slate-600">{project.name} projesi</p>
              </div>
            </div>
            <p className="text-slate-600 max-w-lg">
              Proje için yeni bir görev oluşturun ve ekip üyelerine atayın
            </p>
          </div>
          
          <Button 
            variant="outline" 
            asChild
            className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <Link href={`/projects/${project.id}`} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Projeye Dön
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="xl:col-span-2 space-y-8">
              {/* Basic Info */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">Temel Bilgiler</CardTitle>
                      <CardDescription className="text-slate-600">Görevin başlık ve açıklamasını girin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="title" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Başlık <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Görev başlığını girin..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-lg"
                    />
                    {title && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {title.length} karakter
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="description" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Açıklama
                    </label>
                    <textarea
                      id="description"
                      className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Görevin detaylı açıklamasını yazın..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                    />
                    {description && (
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {description.length} karakter
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Type & Priority */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">Görev Özellikleri</CardTitle>
                      <CardDescription className="text-slate-600">Görev tipini ve önceliğini belirleyin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Görev Tipi
                      </label>
                      <div className="space-y-2">
                        {typeOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors duration-200">
                            <input
                              type="radio"
                              name="type"
                              value={option.value}
                              checked={type === option.value}
                              onChange={(e) => setType(e.target.value)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              type === option.value 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-slate-300'
                            }`}>
                              {type === option.value && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <p className="font-semibold text-slate-800">{option.label}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Priority Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Öncelik Seviyesi
                      </label>
                      <div className="space-y-2">
                        {priorityOptions.map((option) => (
                          <label key={option.value} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors duration-200">
                            <input
                              type="radio"
                              name="priority"
                              value={option.value}
                              checked={priority === option.value}
                              onChange={(e) => setPriority(e.target.value)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              priority === option.value 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-slate-300'
                            }`}>
                              {priority === option.value && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className={`w-3 h-3 rounded-full ${option.dot}`}></div>
                            <div>
                              <p className="font-semibold text-slate-800">{option.label}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Assignment */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Atama</CardTitle>
                      <CardDescription className="text-slate-600">Görevi bir üyeye atayın</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Atanan Kişi</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-200">
                        <input
                          type="radio"
                          name="assignee"
                          value=""
                          checked={assigneeId === ''}
                          onChange={(e) => setAssigneeId(e.target.value)}
                          className="hidden"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          assigneeId === '' 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-slate-300'
                        }`}>
                          {assigneeId === '' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-slate-600 font-medium">Atanmamış</span>
                      </label>

                      {project.members?.map((member) => {
                        const userId = member.user?.id || member.userId;
                        const userName = member.user?.name || 'Unknown';
                        const userEmail = member.user?.email || 'Unknown';
                        
                        return (
                          <label key={userId} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-200">
                            <input
                              type="radio"
                              name="assignee"
                              value={userId}
                              checked={assigneeId === userId}
                              onChange={(e) => setAssigneeId(e.target.value)}
                              className="hidden"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                              assigneeId === userId 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-slate-300'
                            }`}>
                              {assigneeId === userId && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {userName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{userName}</p>
                              <p className="text-xs text-slate-500">{userEmail}</p>
                            </div>
                          </label>
                        );
                      }) || []}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-800">Önizleme</CardTitle>
                      <CardDescription className="text-slate-600">Görev kartı önizlemesi</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border border-slate-200 rounded-xl bg-white/50">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {project.key}-XXXX
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedType.icon}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${selectedPriority.color}`}>
                          {selectedPriority.label}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">
                      {title || 'Görev başlığı...'}
                    </h4>
                    
                    {description && (
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                        {description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-slate-500">
                          {new Date().toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      
                      {assigneeId && (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {project.members?.find(m => (m.user?.id || m.userId) === assigneeId)?.user?.name.split(' ').map(n => n[0]).join('') || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !title.trim()}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Oluşturuluyor...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Görev Oluştur
                    </div>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="w-full h-12 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    İptal
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}