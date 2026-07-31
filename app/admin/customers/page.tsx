import React from 'react'
import { prisma } from '@/lib/prisma'
import { CsvExportButton } from '../_components/csv-export-button'
export const dynamic = 'force-dynamic'
import CustomersTable from './_components/customers-table'

async function getCustomers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          createdAt: true,
        },
      },
      _count: {
        select: { orders: true },
      },
    },
  })
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers()

  const csvData = customers.map((c) => ({
    ...c,
    totalSpent: Number(c.orders.reduce((sum, o) => sum + Number(o.total), 0)),
    orderCount: c._count.orders,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kunden</h1>
          <p className="text-sm text-slate-500">
            Verwalten Sie Ihren Kundenstamm und analysieren Sie deren Aktivitäten (
            {customers.length} Benutzer)
          </p>
        </div>
        <div className="flex gap-2">
          <CsvExportButton
            data={csvData}
            columns={[
              { header: 'Name', accessor: (r) => String(r.name || '') },
              { header: 'E-Mail', accessor: (r) => String(r.email) },
              { header: 'Rolle', accessor: (r) => String(r.role) },
              { header: 'Registriert', accessor: (r) => String(r.createdAt) },
              { header: 'Bestellungen', accessor: (r) => Number(r.orderCount) },
              { header: 'Ausgaben (EUR)', accessor: (r) => Number(r.totalSpent) },
            ]}
            filename={`kunden-export-${new Date().toISOString().slice(0, 10)}.csv`}
          />
        </div>
      </div>

      {/* Filters & Table */}
      <CustomersTable
        initialCustomers={
          customers as unknown as React.ComponentProps<typeof CustomersTable>['initialCustomers']
        }
      />
    </div>
  )
}
