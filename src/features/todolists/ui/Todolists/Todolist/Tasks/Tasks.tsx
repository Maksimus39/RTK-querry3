import List from "@mui/material/List"
import { TaskStatus } from "common/enums"
import { useState } from "react"
import { useGetTasksQuery } from "../../../../api/tasksApi"
import { DomainTodolist } from "../../../../lib/types/types"
import { TasksSkeleton } from "../../../skeletons/TasksSkeleton/TasksSkeleton"
import { TasksPagination } from "../TasksPagination/TasksPagination"
import { Task } from "./Task/Task"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const [page, setPage] = useState(1)
  const { data, isLoading, isFetching } = useGetTasksQuery({ todolistId: todolist.id, args: { page } })

  console.log("isLoading", isLoading)
  console.log("isFetching", isFetching)

  let tasksForTodolist = data?.items

  if (todolist.filter === "active") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.New)
  }

  if (todolist.filter === "completed") {
    tasksForTodolist = tasksForTodolist?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {tasksForTodolist?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          <List>
            {tasksForTodolist?.map((task) => {
              return <Task key={task.id} task={task} todolist={todolist} />
            })}
          </List>
          <TasksPagination totalCount={data?.totalCount || 0} page={page} setPage={setPage} />
        </>
      )}
    </>
  )
}
