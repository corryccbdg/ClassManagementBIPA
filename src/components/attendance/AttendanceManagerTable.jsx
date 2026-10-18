import React from 'react';
import { Check, UserCheck, UserX, Clock, HelpCircle, CheckCheck, Users } from 'lucide-react';

export default function AttendanceManagerTable({
  students,
  attendances,
  onStatusChange,
  onNoteChange,
  onMarkAllPresent,
  disabled = false,
}) {
  const counts = {
    PRESENT: Object.values(attendances).filter((a) => a.status === 'PRESENT').length,
    EXCUSED: Object.values(attendances).filter((a) => a.status === 'EXCUSED').length,
    LATE: Object.values(attendances).filter((a) => a.status === 'LATE').length,
    ABSENT: Object.values(attendances).filter((a) => a.status === 'ABSENT').length,
  };

  const total = students.length;

  return (
    <div className="space-y-4">
      {/* Top Header & Dynamic Summary Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-200/70">
        {/* Summary Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Total {total} Students</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{counts.PRESENT} Present</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{counts.EXCUSED} Excused</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{counts.LATE} Late</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 shadow-xs">
            <UserX className="w-3.5 h-3.5 text-rose-600" />
            <span>{counts.ABSENT} Absent</span>
          </div>
        </div>

        {/* Quick Action: Mark All Present */}
        {!disabled && (
          <button
            type="button"
            onClick={onMarkAllPresent}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/10 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            Mark All Present
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">No</th>
              <th className="py-3.5 px-4">International Student</th>
              <th className="py-3.5 px-4">Country and NIM</th>
              <th className="py-3.5 px-4 text-center">Attendance Status</th>
              <th className="py-3.5 px-4">Special Notes Optional</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student, idx) => {
              const currentAtt = attendances[student.id] || { status: 'PRESENT', notes: '' };

              return (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    currentAtt.status === 'ABSENT' ? 'bg-rose-50/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shadow-2xs">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-[11px] text-slate-400">BIPA B1 Student</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-700">{student.country}</div>
                    <div className="text-[11px] font-mono text-slate-400">{student.nim}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {/* Inline Segmented Control */}
                    <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80 shadow-2xs">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onStatusChange(student.id, 'PRESENT')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          currentAtt.status === 'PRESENT'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Present"
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onStatusChange(student.id, 'EXCUSED')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          currentAtt.status === 'EXCUSED'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Excused Medical"
                      >
                        Excused
                      </button>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onStatusChange(student.id, 'LATE')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          currentAtt.status === 'LATE'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Late"
                      >
                        Late
                      </button>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onStatusChange(student.id, 'ABSENT')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                          currentAtt.status === 'ABSENT'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Unexcused Absence"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      disabled={disabled}
                      value={currentAtt.notes || ''}
                      onChange={(e) => onNoteChange(student.id, e.target.value)}
                      placeholder="Notes"
                      className="w-full max-w-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-300 outline-none focus:bg-white focus:border-indigo-400 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
