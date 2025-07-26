'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/contexts/LanguageContext'

interface Issue {
  id: string
  title: string
  type: string
  status: string
  priority: string
  assignee?: {
    name: string
  }
  createdAt: string
}

interface Project {
  id: string
  name: string
  key: string
  description?: string
  members: {
    user: {
      name: string
      email: string
    }
    role: string
  }[]
  issues: Issue[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const { t, isReady, language } = useLanguage()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-slate-100 text-slate-700 border-slate-200'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'IN_REVIEW': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'DONE': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return '📋'
      case 'IN_PROGRESS': return '⚡'
      case 'IN_REVIEW': return '👀'
      case 'DONE': return '✅'
      default: return '📋'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGHEST': return 'text-red-600 bg-red-50 border-red-200'
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
      case 'LOWEST': return 'text-slate-600 bg-slate-50 border-slate-200'
      default: return 'text-slate-600 bg-slate-50 border-slate-200'
    }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return '👑'
      case 'ADMIN': return '⚙️'
      case 'MEMBER': return '👤'
      default: return '👤'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-slate-600 font-medium">{isReady ? t('project.loading') : 'Proje yükleniyor...'}</p>
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
              <h3 className="text-xl font-bold text-slate-800">{isReady ? t('project.notFound') : 'Proje Bulunamadı'}</h3>
              <p className="text-slate-600">{isReady ? t('project.notFoundDesc') : 'Aradığınız proje mevcut değil veya erişim yetkiniz bulunmuyor.'}</p>
              <Button asChild>
                <Link href="/projects">{isReady ? t('project.backToProjects') : 'Projelere Dön'}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statusCounts = project.issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">{project.key}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-slate-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {project.members.length} {isReady ? t('project.members') : 'üye'}
                  </span>
                  <span className="text-slate-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    {project.issues.length} {isReady ? t('project.tasks') : 'görev'}
                  </span>
                </div>
              </div>
            </div>
            {project.description && (
              <p className="text-slate-600 text-lg max-w-2xl">{project.description}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              asChild
              className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <Link href={`/projects/${project.id}/board`} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                {isReady ? t('project.kanbanBoard') : 'Kanban Board'}
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <Link href={`/projects/${project.id}/members`} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {isReady ? t('project.manageMembers') : 'Üyeleri Yönet'}
              </Link>
            </Button>
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Link href={`/projects/${project.id}/issues/new`} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {isReady ? t('project.newTask') : 'Yeni Görev'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{isReady ? t('project.todo') : 'Yapılacak'}</p>
                  <p className="text-2xl font-bold text-slate-800">{statusCounts.TODO || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{isReady ? t('project.inProgress') : 'Devam Eden'}</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.IN_PROGRESS || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👀</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{isReady ? t('project.inReview') : 'İncelemede'}</p>
                  <p className="text-2xl font-bold text-amber-600">{statusCounts.IN_REVIEW || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{isReady ? t('project.done') : 'Tamamlanan'}</p>
                  <p className="text-2xl font-bold text-emerald-600">{statusCounts.DONE || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">{isReady ? t('project.recentTasks') : 'Son Görevler'}</CardTitle>
                    <CardDescription className="text-slate-600">{isReady ? t('project.recentTasksDesc') : 'Projedeki güncel görevler'}</CardDescription>
                  </div>
                  {project.issues.length > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/projects/${project.id}/issues`}>{isReady ? t('project.seeAll') : 'Tümünü Gör'}</Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {project.issues.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{isReady ? t('project.noTasks') : 'Henüz görev bulunmuyor'}</h3>
                    <p className="text-slate-600 mb-6">{isReady ? t('project.noTasksDesc') : 'Projeniz için ilk görevi oluşturarak başlayın'}</p>
                    <Button asChild>
                      <Link href={`/projects/${project.id}/issues/new`}>{isReady ? t('project.createFirstTask') : 'İlk Görevi Oluştur'}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.issues.slice(0, 5).map((issue) => (
                      <Link key={issue.id} href={`/projects/${project.id}/issues/${issue.id}`}>
                        <div className="group p-6 border border-slate-200 rounded-xl hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200 bg-white/50 hover:bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-2xl">{getTypeIcon(issue.type)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {project.key}-{issue.id.slice(-4)}
                                  </span>
                                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(issue.status)}`}>
                                    {getStatusIcon(issue.status)} {isReady ? t(`tasks.status.${issue.status}`) : issue.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                  {issue.title}
                                </h4>
                                <div className="flex items-center gap-3">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(issue.priority)}`}>
                                    {isReady ? t(`tasks.priority.${issue.priority}`) : issue.priority}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(issue.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'tr-TR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {issue.assignee && (
                              <div className="flex items-center gap-2 ml-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">
                                    {issue.assignee.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="text-sm text-slate-600 hidden sm:block">{issue.assignee.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">{isReady ? t('project.teamMembers') : 'Takım Üyeleri'}</CardTitle>
                    <CardDescription className="text-slate-600">{project.members.length} {isReady ? t('project.activeMembers') : 'aktif üye'}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}/members`}>{isReady ? t('project.manage') : 'Yönet'}</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/70 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {member.user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{member.user.name}</p>
                          <p className="text-sm text-slate-600">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getRoleIcon(member.role)}</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                          {isReady ? t(`members.roles.${member.role}`) : member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}