'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Issue {
  id: string
  title: string
  description?: string
  type: string
  status: string
  priority: string
  estimate?: number
  createdAt: string
  updatedAt: string
  assignee?: {
    id: string
    name: string
    email: string
  }
  creator: {
    id: string
    name: string
    email: string
  }
  project: {
    id: string
    name: string
    key: string
  }
  comments: {
    id: string
    content: string
    createdAt: string
    user: {
      name: string
      email: string
    }
  }[]
}

const statusOptions = [
  { 
    value: 'TODO', 
    label: 'Yapılacak', 
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: '📋'
  },
  { 
    value: 'IN_PROGRESS', 
    label: 'Devam Ediyor', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '⚡'
  },
  { 
    value: 'IN_REVIEW', 
    label: 'İncelemede', 
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: '👀'
  },
  { 
    value: 'DONE', 
    label: 'Tamamlandı', 
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '✅'
  },
]

const priorityOptions = [
  { value: 'LOWEST', label: 'En Düşük', color: 'text-slate-600 bg-slate-100 border-slate-200' },
  { value: 'LOW', label: 'Düşük', color: 'text-green-600 bg-green-100 border-green-200' },
  { value: 'MEDIUM', label: 'Orta', color: 'text-yellow-600 bg-yellow-100 border-yellow-200' },
  { value: 'HIGH', label: 'Yüksek', color: 'text-orange-600 bg-orange-100 border-orange-200' },
  { value: 'HIGHEST', label: 'En Yüksek', color: 'text-red-600 bg-red-100 border-red-200' },
]

export default function IssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    if (params.id && params.issueId) {
      fetchIssue()
    }
  }, [params.id, params.issueId])

  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/issues/${params.issueId}`)
      if (response.ok) {
        const data = await response.json()
        setIssue(data)
      } else {
        toast.error('Görev bulunamadı')
        router.push(`/projects/${params.id}`)
      }
    } catch (error) {
      console.error('Error fetching issue:', error)
      toast.error('Görev yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!issue) return

    try {
      const response = await fetch(`/api/projects/${params.id}/issues/${params.issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedIssue = await response.json()
        setIssue(updatedIssue)
        const statusConfig = getStatusConfig(newStatus)
        toast.success(`Durum "${statusConfig.label}" olarak güncellendi`)
      } else {
        toast.error('Durum güncellenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Durum güncellenirken hata oluştu')
    }
  }

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingComment(true)
    try {
      const response = await fetch(`/api/projects/${params.id}/issues/${params.issueId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment('')
        await fetchIssue() // Refresh to get new comment
        toast.success('Yorum eklendi')
      } else {
        toast.error('Yorum eklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Yorum eklenirken hata oluştu')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const getStatusConfig = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const getPriorityConfig = (priority: string) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[2]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TASK': return '📝'
      case 'BUG': return '🐛'
      case 'STORY': return '📖'
      case 'EPIC': return '🚀'
      default: return '📝'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-slate-600 font-medium">Görev yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!issue) {
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
              <h3 className="text-xl font-bold text-slate-800">Görev Bulunamadı</h3>
              <p className="text-slate-600">Aradığınız görev mevcut değil veya erişim yetkiniz bulunmuyor.</p>
              <Button asChild>
                <Link href="/projects">Projelere Dön</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(issue.status)
  const priorityConfig = getPriorityConfig(issue.priority)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/projects" className="hover:text-blue-600 transition-colors duration-200">Projeler</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/projects/${issue.project.id}`} className="hover:text-blue-600 transition-colors duration-200">
            {issue.project.name}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 font-medium">{issue.project.key}-{issue.id.slice(-4)}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">{getTypeIcon(issue.type)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {issue.project.key}-{issue.id.slice(-4)}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${statusConfig.color}`}>
                    {statusConfig.icon} {statusConfig.label}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${priorityConfig.color}`}>
                    {priorityConfig.label}
                  </span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {issue.title}
                </h1>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            asChild
            className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <Link href={`/projects/${issue.project.id}`} className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Projeye Dön
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">Açıklama</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {issue.description ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{issue.description}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">Henüz açıklama eklenmemiş</p>
                    <p className="text-slate-400 text-sm">Bu görev için detaylı bir açıklama henüz yazılmamış</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">
                      Yorumlar
                    </CardTitle>
                  </div>
                  <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {issue.comments.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 mb-8">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-semibold">
                            {comment.user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-slate-800">{comment.user.name}</h4>
                              <p className="text-sm text-slate-500">{comment.user.email}</p>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              {new Date(comment.createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {issue.comments.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium mb-2">Henüz yorum yok</p>
                      <p className="text-slate-400 text-sm">Bu görev için ilk yorumu siz ekleyin</p>
                    </div>
                  )}
                </div>

                <form onSubmit={addComment} className="space-y-4">
                  <div className="relative">
                    <textarea
                      className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      rows={4}
                      placeholder="Yorum ekleyin..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      {isSubmittingComment ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Ekleniyor...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Yorum Ekle
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Durum Değiştir</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => updateStatus(status.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        issue.status === status.value
                          ? status.color + ' ring-2 ring-blue-500 shadow-md'
                          : 'hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{status.icon}</span>
                        <span>{status.label}</span>
                        {issue.status === status.value && (
                          <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Detaylar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-sm font-semibold text-slate-600 mb-2 block">Atanan Kişi</span>
                  {issue.assignee ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {issue.assignee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{issue.assignee.name}</p>
                        <p className="text-sm text-slate-600">{issue.assignee.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-slate-500 text-sm">Henüz atanmamış</p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-sm font-semibold text-slate-600 mb-2 block">Oluşturan</span>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {issue.creator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{issue.creator.name}</p>
                      <p className="text-sm text-slate-600">{issue.creator.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Oluşturulma</span>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-800 font-medium">
                        {new Date(issue.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(issue.createdAt).toLocaleTimeString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-slate-600 mb-2 block">Son Güncelleme</span>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-800 font-medium">
                        {new Date(issue.updatedAt).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(issue.updatedAt).toLocaleTimeString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}