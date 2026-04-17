import { FiUsers, FiShield, FiUserX } from 'react-icons/fi';
import { useGetAllUsersQuery, useToggleUserRoleMutation } from '../../store/api/ordersApi';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const { data, isLoading } = useGetAllUsersQuery();
  const [toggleRole] = useToggleUserRoleMutation();
  const { user: currentUser } = useSelector((s) => s.auth);

  const handleToggle = async (id, name, currentRole) => {
    if (id === currentUser?._id) { toast.error("Can't change your own role"); return; }
    if (!confirm(`Change ${name}'s role from ${currentRole} to ${currentRole === 'admin' ? 'user' : 'admin'}?`)) return;
    try {
      await toggleRole(id).unwrap();
      toast.success('Role updated!');
    } catch { toast.error('Failed to update role'); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
        <p className="text-slate-400 text-sm">{data?.users?.length || 0} registered users</p>
      </div>

      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Auth</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-10 rounded-xl" /></td></tr>
                ))
                : data?.users?.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-slate-900 font-bold text-xs flex-shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-slate-900 font-medium">{u.name}</p>
                          {u._id === currentUser?._id && <p className="text-xs text-slate-900">(You)</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${u.role === 'admin' ? 'badge-primary' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${u.googleId ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                        {u.googleId ? 'Google' : 'Email'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(u._id, u.name, u.role)}
                        disabled={u._id === currentUser?._id}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                          u.role === 'admin'
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-slate-300 text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {u.role === 'admin' ? <><FiUserX size={12} /> Revoke Admin</> : <><FiShield size={12} /> Make Admin</>}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !data?.users?.length && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto text-slate-600 mb-2" size={36} />
            <p className="text-slate-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
