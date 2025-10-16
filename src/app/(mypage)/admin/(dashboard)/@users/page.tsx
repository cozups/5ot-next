import UserList from "@/components/admin/user-list";

export default function UserListPage() {
  return (
    <div className="h-96 bg-gray-100 rounded-2xl p-4 flex flex-col">
      <h2 className="text-xl font-semibold">회원</h2>
      <UserList />
    </div>
  );
}
