
type UserRole ={
    name:string,
    id: number
}

const checkRole = (role:string, userRoles:UserRole[]) => {
    return userRoles.filter((userRole) => userRole.name === role).length > 0;
    };


const checkMultipleRoles = (roles:string[], userRoles:UserRole[]) => {
    return roles.filter((role) => checkRole(role, userRoles)).length > 0;
    }



export { checkRole, checkMultipleRoles };