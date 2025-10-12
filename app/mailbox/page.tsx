import { prisma } from '../../lib/prismaClient'
import { getEntityFromToken } from '../../lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Mailbox(){
  const token = cookies().get('token')?.value
  const entity = await getEntityFromToken(token)
  if (!entity || entity.type !== 'admin') {
    redirect('/auth/login')
  }

  const notes = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  return (
    <div>
      <h2 className="text-2xl font-semibold">Local Mailbox</h2>
      <p className="text-sm text-slate-600">All notifications & emails are stored locally in the DB (no external email).</p>
      <ul className="mt-4 space-y-2">
        {notes.map(n=> (
          <li key={n.id} className="bg-white p-3 rounded">
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-slate-700">{n.body}</div>
            <div className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
