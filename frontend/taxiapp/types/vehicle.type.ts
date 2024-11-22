import { User } from "./user.type"

export type Vehicle = {
    id: string
    brand: string
    model: string
    year: string
    status: string
    details: string
    color: string
    driver: User | null
    license_plate: string
    isDisabled: boolean
    deleted: boolean
}