import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CheckIn {
    id: bigint;
    memberId: bigint;
    timestamp: Time;
}
export type Time = bigint;
export interface Member {
    id: bigint;
    status: MemberStatus;
    contact: string;
    planId?: bigint;
    name: string;
    createdAt: Time;
    membershipStart?: Time;
    updatedAt: Time;
    membershipEnd?: Time;
}
export interface Payment {
    id: bigint;
    memberId: bigint;
    method: string;
    date: Time;
    notes: string;
    amount: number;
}
export interface UserProfile {
    memberId?: bigint;
    name: string;
}
export enum MemberStatus {
    active = "active",
    inactive = "inactive"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPayment(memberId: bigint, amount: number, method: string, notes: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkIn(memberId: bigint): Promise<bigint>;
    createMember(name: string, contact: string): Promise<bigint>;
    getAllMembers(): Promise<Array<Member>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCheckInsForMember(memberId: bigint): Promise<Array<CheckIn>>;
    getMember(id: bigint): Promise<Member>;
    getPaymentsForMember(memberId: bigint): Promise<Array<Payment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    linkPrincipalToMember(user: Principal, memberId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMember(id: bigint, name: string, contact: string): Promise<void>;
}
