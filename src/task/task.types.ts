import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

export enum TASK_STATUS {
    PENDING = "pending",
    BACKLOG = "backlog",
    COMPLETED = "completed",
    IN_PROGRESS = "in_progress",
}
export enum TASK_PRIORITY {
    LOW = "low",
    HIGH = "high",
    MEDIUM = "medium",
}

export interface CreateTaskServicePayload {
    userId: string,
    projectId: string,
    createTaskDto: CreateTaskDto
}

export interface UpdateTaskServicePayload {
    id: string
    projectId: string,
    updatedPayload: UpdateTaskDto
}

export interface DeleteTaskServicePayload {
    id: string
    projectId: string,
}