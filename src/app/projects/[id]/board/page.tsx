'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  rectIntersection,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Issue {
  id: string
  title: string
  description?: string
  type: string
  status: string
  priority: string
  assignee?: {
    name: string
    email: string
  }
  creator: {
    name: string
    email: string
  }
}

interface Project {
  id: string
  name: string
  key: string
  issues: Issue[]
}

interface Column {
  id: string
  title: string
  status: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

const columns: Column[] = [
  { 
    id: 'TODO', 
    title: 'Yapılacaklar', 
    status: 'TODO', 
    color: 'bg-slate-50 border-slate-200',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: '📋'
  },
  { 
    id: 'IN_PROGRESS', 
    title: 'Devam Ediyor', 
    status: 'IN_PROGRESS', 
    color: 'bg-blue-50 border-blue-200',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '⚡'
  },
  { 
    id: 'IN_REVIEW', 
    title: 'İncelemede', 
    status: 'IN_REVIEW', 
    color: 'bg-amber-50 border-amber-200',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: '👀'
  },
  { 
    id: 'DONE', 
    title: 'Tamamlandı', 
    status: 'DONE', 
    color: 'bg-emerald-50 border-emerald-200',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: '✅'
  },
]

function IssueCard({ issue, isOverlay = false }: { issue: Issue; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGHEST': return 'border-l-red-500 bg-red-50'
      case 'HIGH': return 'border-l-orange-500 bg-orange-50'
      case 'MEDIUM': return 'border-l-yellow-500 bg-yellow-50'
      case 'LOW': return 'border-l-green-500 bg-green-50'
      case 'LOWEST': return 'border-l-slate-500 bg-slate-50'
      default: return 'border-l-slate-500 bg-slate-50'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGHEST': return 'bg-red-100 text-red-700 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200'
      case 'LOWEST': return 'bg-slate-100 text-slate-700 border-slate-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white rounded-xl border-l-4 ${getPriorityColor(issue.priority)} shadow-sm hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing border border-slate-200 ${
        isOverlay ? 'rotate-3 scale-105 shadow-2xl' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded font-medium">
            {issue.id.slice(-4)}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(issue.type)}</span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityBadge(issue.priority)}`}>
              {issue.priority}
            </span>
          </div>
        </div>
        
        <h4 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {issue.title}
        </h4>
        
        {issue.description && (
          <p className="text-xs text-slate-600 mb-3 line-clamp-2">
            {issue.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-slate-500">
              {new Date().toLocaleDateString('tr-TR')}
            </span>
          </div>
          
          {issue.assignee && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-xs text-white font-semibold">
                  {issue.assignee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DroppableColumn({ column, issues }: { column: Column; issues: Issue[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 transition-all duration-200 min-h-[600px] ${column.color} ${
        isOver ? 'border-blue-400 bg-blue-50 shadow-lg scale-[1.02]' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{column.icon}</span>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{column.title}</h3>
              <p className="text-xs text-slate-600">{issues.length} görev</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-slate-700">{issues.length}</span>
          </div>
        </div>
        
        <SortableContext items={issues.map(issue => issue.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
            {issues.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Bu sütunda görev yok</p>
                  <p className="text-xs text-slate-400">Görevleri buraya sürükleyin</p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default function BoardPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

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
      toast.error('Proje yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeIssue = project?.issues.find(issue => issue.id === active.id)
    setActiveIssue(activeIssue || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveIssue(null)

    if (!over || !project) return

    const activeIssue = project.issues.find(issue => issue.id === active.id)
    if (!activeIssue) return

    // Check if dropped on a column
    const newStatus = over.id as string
    const targetColumn = columns.find(col => col.id === newStatus)
    
    if (!targetColumn || newStatus === activeIssue.status) return

    try {
      const response = await fetch(`/api/projects/${params.id}/issues/${activeIssue.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setProject(prev => {
          if (!prev) return prev
          return {
            ...prev,
            issues: prev.issues.map(issue =>
              issue.id === activeIssue.id ? { ...issue, status: newStatus } : issue
            )
          }
        })
        toast.success(`Görev "${targetColumn.title}" sütununa taşındı`)
      } else {
        toast.error('Görev güncellenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error updating issue:', error)
      toast.error('Görev güncellenirken hata oluştu')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="text-slate-600 font-medium">Kanban board yükleniyor...</p>
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

  const statusCounts = project.issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <p className="text-slate-600">Kanban Board</p>
              </div>
            </div>
            <p className="text-slate-600 max-w-lg">
              Görevleri sürükleyerek farklı durumlara taşıyın ve iş akışınızı kolayca yönetin
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
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
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Link href={`/projects/${project.id}/issues/new`} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni Görev
              </Link>
            </Button>
          </div>
        </div>

        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
          collisionDetection={rectIntersection}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {columns.map((column) => {
              const columnIssues = project.issues.filter(issue => issue.status === column.status)
              return (
                <DroppableColumn key={column.id} column={column} issues={columnIssues} />
              )
            })}
          </div>

          <DragOverlay>
            {activeIssue ? <IssueCard issue={activeIssue} isOverlay={true} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}