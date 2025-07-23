export function TaskList({ tasks }: { tasks: any[] }) {
  return (
    <ul className="space-y-2 mt-4">
      {tasks.map((task) => (
        <li key={task.id} className="p-4 border rounded-md shadow-sm flex justify-between">
          <span>{task.name}</span>
          <span className="text-xs text-muted-foreground">{task.status}</span>
        </li>
      ))}
    </ul>
  );
}
