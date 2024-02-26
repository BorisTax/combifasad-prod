import { UserRoles } from "../types/server.js";
export function isClientAtLeast(role) {
    return isManagerAtLeast(role) || role === UserRoles.CLIENT;
}
export function isManagerAtLeast(role) {
    return isEditorAtLeast(role) || role === UserRoles.MANAGER;
}
export function isEditorAtLeast(role) {
    return isAdminAtLeast(role) || role === UserRoles.EDITOR;
}
export function isAdminAtLeast(role) {
    return role === UserRoles.ADMIN;
}
