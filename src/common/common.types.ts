import express from "express"

export interface AuthenticatedUser {
    sub: string
    email: string
}