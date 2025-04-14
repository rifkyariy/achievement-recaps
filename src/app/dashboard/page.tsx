// app/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Row {
  student_name: string
  type: string
  class: string
  subclass: string
  category: string
  competition_type: string
  competition_status: string
  competition_fullname: string
  competition_level: string
  competition_region: string
  competition_organizer: string
  competition_start_date: string
  competition_end_date: string
  competition_supervisor_name: string
  competition_name: string
  competition_appreciation: string
}

const columnMap = [
  "student_name",
  "type",
  "class",
  "subclass",
  "category",
  "competition_type",
  "competition_status",
  "competition_fullname",
  "competition_level",
  "competition_region",
  "competition_organizer",
  "competition_start_date",
  "competition_end_date",
  "competition_supervisor_name",
  "competition_name",
  "competition_appreciation",
]

export default function DashboardPage() {
  const [data, setData] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const spreadsheetId = "1PDQmDwSTNtsgJzfKaBCEbTe3fBSEUeplAiL3-GKviXA"
      const apiKey = "AIzaSyDzumKhspcAFvdD1alG3jAnxQ2cMPZG5wQ"
      const range = "DATA_ACHIEVEMENT!A2:P100"
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

      try {
        const response = await fetch(url)
        const json = await response.json()
        const values = json.values ?? []

        const mapped: Row[] = values.map((row: string[]) => {
          const rowObj: any = {}
          columnMap.forEach((key, i) => {
            rowObj[key] = row[i] || ""
          })
          return rowObj
        })

        setData(mapped)
      } catch (error) {
        console.error("Error fetching spreadsheet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const yearlyAchievementByCategory = data.reduce((acc, row) => {
    const year = new Date(row.competition_start_date).getFullYear()
    const key = `${year}-${row.category}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const yearlyAchievementByLevel = data.reduce((acc, row) => {
    const year = new Date(row.competition_start_date).getFullYear()
    const key = `${year}-${row.competition_level}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalAchievementThisYear = data.filter(
    row => new Date(row.competition_start_date).getFullYear() === currentYear
  ).length

  const totalAchievementThisMonth = data.filter(row => {
    const date = new Date(row.competition_start_date)
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth
  }).length

  const formatChartData = (record: Record<string, number>) => {
    return Object.entries(record).map(([key, value]) => {
      const [year, label] = key.split("-")
      return { year, label, value }
    })
  }

  const categoryData = formatChartData(yearlyAchievementByCategory)
  const levelData = formatChartData(yearlyAchievementByLevel)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Achievement This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAchievementThisYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Achievement This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAchievementThisMonth}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Yearly Achievement by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yearly Achievement by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={levelData}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
