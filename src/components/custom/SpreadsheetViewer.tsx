"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SpreadsheetViewer() {
  const [data, setData] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const spreadsheetId = "1PDQmDwSTNtsgJzfKaBCEbTe3fBSEUeplAiL3-GKviXA"
    const apiKey = "AIzaSyDzumKhspcAFvdD1alG3jAnxQ2cMPZG5wQ"
    const range = "DATA_SISWA!B1:G10"

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`

    try {
      const response = await fetch(url)
      const json = await response.json()

      console.log("Spreadsheet data:", json)
      setData(json.values ?? [])
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const hasHeader = data.length > 0
  const headers = hasHeader ? data[0] : []
  const rows = hasHeader ? data.slice(1) : []

  const convertCamelCaseToWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className="p-6 bg-white shadow rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Spreadsheet Data</h2>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? "Loading..." : "Reload Data"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          {hasHeader && (
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i}>{
                    convertCamelCaseToWords(header)
                  }</TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length || 1} className="text-center">
                  {loading ? "Loading..." : "No data found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
