"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { BottomNav } from "@/components/custom/FloatingMenu"
import AchievementList from "@/components/custom/AchievementList"
import Image from "next/image"

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

export function QuickCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export function WelcomeCard() {
  return (
    <Card className="bg-violet-600 p-0">
      <div className="flex justify-between p-0">

        {/* Main container */}
        <div className="flex items-center justify-center relative" style={{ minHeight: '200px' }}>

          {/* Content (Text and Button) */}
          <div className="relative z-10 px-6 flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-white font-bold">
                Welcome to Sekolah Teladan Achievement Recaps!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-100">
                Here are your achievements and records of excellence. Track your progress and celebrate your success!
              </p>

              <Button variant="outline" className="mt-4">
                View Achievements
              </Button>
            </CardContent>
          </div>

          {/* Image at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-full">
            <Image
              src="/assets/images/student.png"
              alt="Student Achievement"
              width={2000}
              height={2000}
              quality={100}
              objectFit="cover"
              style={{ objectPosition: 'top left' }} // Make the image align to the bottom left
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}


export default function DashboardPage() {
  const [data, setData] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const spreadsheetId = "1PDQmDwSTNtsgJzfKaBCEbTe3fBSEUeplAiL3-GKviXA"
      const apiKey = "AIzaSyDzumKhspcAFvdD1alG3jAnxQ2cMPZG5wQ"
      const range = "DATA_ACHIEVEMENT!A2:P1000"
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

  const currentYear = 2024
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
    row => new Date(row.competition_end_date).getFullYear() === currentYear


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
    <div className="p-6 space-y-6 px-12" >
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <WelcomeCard />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickCard title="Total Achievements This Year" value={totalAchievementThisYear} />
        <QuickCard title="Total Achievements This Month" value={totalAchievementThisMonth} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      </div> */}

      <div className="grid grid-cols-1">
        <AchievementList />
      </div>

    </div>
  )
}

