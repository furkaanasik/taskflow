'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectMember {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface Project {
  id: string
  name: string
  key: string
  description?: string
  creator: {
    id: string
    name: string
    email: string
  }
  members: ProjectMember[]
}

interface User {
  id: string
  name: string
  email: string
}

export default function ProjectMembersPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/members`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast.error('Proje yüklenirken hata oluştu')
        router.push('/projects')
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast.error('Proje yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!searchEmail.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/users/search?email=${encodeURIComponent(searchEmail)}`)
      if (response.ok) {
        const users = await response.json()
        setSearchResults(users)
      } else {
        toast.error('Kullanıcı aranırken hata oluştu')
      }
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Kullanıcı aranırken hata oluştu')
    } finally {
      setIsSearching(false)
    }
  }

  const inviteUser = async (userId: string) => {
    setIsInviting(true)
    try {
      const response = await fetch(`/api/projects/${params.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success('Kullanıcı projeye eklendi')
        setSearchEmail('')
        setSearchResults([])
        await fetchProject(params.id as string)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Kullanıcı eklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      toast.error('Kullanıcı eklenirken hata oluştu')
    } finally {
      setIsInviting(false)
    }
  }

  const removeMember = async (memberId: string, memberName: string) => {
    if (!confirm(`${memberName} adlı üyeyi projeden çıkarmak istediğinizden emin misiniz?`)) return

    try {
      const response = await fetch(`/api/projects/${params.id}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Üye projeden çıkarıldı')
        await fetchProject(params.id as string)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Üye çıkarılırken hata oluştu')
      }
    } catch (error) {
      console.error('Error removing member:', error)
      toast.error('Üye çıkarılırken hata oluştu')
    }
  }

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/projects/${params.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast.success('Üye rolü güncellendi')
        await fetchProject(params.id as string)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Rol güncellenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Rol güncellenirken hata oluştu')
    }
  }

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'OWNER': 
        return { 
          color: 'bg-purple-100 text-purple-800 border-purple-200', 
          icon: '👑', 
          label: 'Sahip' 
        }
      case 'ADMIN': 
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200', 
          icon: '⚙️', 
          label: 'Admin' 
        }
      case 'MEMBER': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: '👤', 
          label: 'Üye' 
        }
      default: 
        return { 
          color: 'bg-slate-100 text-slate-800 border-slate-200', 
          icon: '👤', 
          label: 'Üye' 
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-slate-600 font-medium">Üyeler yükleniyor...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12">
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
          <span className="text-slate-900 font-medium">Üyeler</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <p className="text-slate-600">Üye Yönetimi</p>
              </div>
            </div>
            <p className="text-slate-600 max-w-lg">
              Proje ekibinizi yönetin, yeni üyeler ekleyin ve rolleri düzenleyin
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add Member */}
          <div>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">Yeni Üye Ekle</CardTitle>
                    <CardDescription className="text-slate-600">E-posta ile kullanıcı arayın</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="kullanici@email.com"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                      className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      onClick={searchUsers} 
                      disabled={isSearching || !searchEmail.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none h-12"
                    >
                      {isSearching ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Aranıyor...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Kullanıcı Ara
                        </div>
                      )}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-slate-700 border-b border-slate-200 pb-2">
                        Bulunan Kullanıcılar ({searchResults.length})
                      </h4>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {searchResults.map((user) => {
                          const isAlreadyMember = project.members.some(m => m.user.id === user.id)
                          return (
                            <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white/50 hover:bg-white transition-colors duration-200">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{user.name}</p>
                                  <p className="text-sm text-slate-600">{user.email}</p>
                                </div>
                              </div>
                              {isAlreadyMember ? (
                                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-full font-medium">
                                  Zaten üye
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => inviteUser(user.id)}
                                  disabled={isInviting}
                                  className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                  {isInviting ? 'Ekleniyor...' : 'Ekle'}
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {searchEmail && searchResults.length === 0 && !isSearching && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">Kullanıcı bulunamadı</p>
                      <p className="text-slate-400 text-sm">Farklı bir e-posta adresi deneyin</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Members List */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800">Proje Üyeleri</CardTitle>
                      <CardDescription className="text-slate-600">Mevcut üyeleri yönetin</CardDescription>
                    </div>
                  </div>
                  <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-semibold">
                    {project.members.length} üye
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member) => {
                    const roleConfig = getRoleConfig(member.role)
                    return (
                      <div key={member.id} className="group p-6 border border-slate-200 rounded-xl bg-white/50 hover:bg-white hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-semibold">
                                {member.user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold text-slate-800">{member.user.name}</h4>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium border flex items-center gap-1 ${roleConfig.color}`}>
                                  <span>{roleConfig.icon}</span>
                                  {roleConfig.label}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">{member.user.email}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(member.joinedAt).toLocaleDateString('tr-TR')} tarihinde katıldı
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {member.role !== 'OWNER' && (
                              <>
                                <select
                                  value={member.role}
                                  onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white hover:border-slate-300 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="MEMBER">Üye</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeMember(member.id, member.user.name)}
                                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}