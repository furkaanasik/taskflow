'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Issue {
  id: string
  title: string
  description?: string
  type: string
  status: string
  priority: string
  createdAt: string
  assignee?: {
    name: string
    email: string
  }
  creator: {
    name: string
    email: string
  }
  project: {
    id: string
    name: string
    key: string
  }
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/issues')
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-800'
      case 'DONE': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGHEST': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      case 'LOWEST': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TASK': return '📋'
      case 'BUG': return '🐛'
      case 'STORY': return '📖'
      case 'EPIC': return '🎯'
      default: return '📋'
    }
  }

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true
    if (filter === 'assigned') return issue.assignee
    if (filter === 'created') return true // We'd need to check if user is creator
    return issue.status === filter
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Görevler yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tüm Görevler</h1>
          <p className="text-gray-600 mt-2">Projelerinizdeki tüm görevleri görüntüleyin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Tümü ({issues.length})
        </Button>
        <Button
          variant={filter === 'TODO' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('TODO')}
        >
          Yapılacak ({issues.filter(i => i.status === 'TODO').length})
        </Button>
        <Button
          variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('IN_PROGRESS')}
        >
          Devam Ediyor ({issues.filter(i => i.status === 'IN_PROGRESS').length})
        </Button>
        <Button
          variant={filter === 'IN_REVIEW' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('IN_REVIEW')}
        >
          İncelemede ({issues.filter(i => i.status === 'IN_REVIEW').length})
        </Button>
        <Button
          variant={filter === 'DONE' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('DONE')}
        >
          Tamamlandı ({issues.filter(i => i.status === 'DONE').length})
        </Button>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Henüz görev yok' : 'Bu filtrede görev yok'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Yeni bir proje oluşturun ve görevler eklemeye başlayın'
              : 'Farklı bir filtre deneyin veya yeni görevler oluşturun'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getTypeIcon(issue.type)}</span>
                      <span className="text-sm font-mono text-gray-500">
                        {issue.project.key}-{issue.id.slice(-4)}
                      </span>
                      <Link 
                        href={`/projects/${issue.project.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {issue.project.name}
                      </Link>
                    </div>
                    
                    <Link 
                      href={`/projects/${issue.project.id}/issues/${issue.id}`}
                      className="block hover:text-blue-600 transition-colors"
                    >
                      <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
                    </Link>
                    
                    {issue.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {issue.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    {issue.assignee && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-semibold">
                            {issue.assignee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{issue.assignee.name}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Oluşturan: {issue.creator.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}