import { User } from "./user.type"
import { Driver } from "./driver.type"

export type Vehicle = {
    id: string
    brand: string
    model: string
    year: string
    status: string
    details: string
    color: string
    driver: Driver
    licensePlate: string
    isDisabled: boolean
    deleted: boolean
}