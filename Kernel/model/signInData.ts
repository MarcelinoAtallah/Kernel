export class SignInData {

  private username: string;
  private password: string;
  private jwtAccessToken: string;
  private refreshToken: string;
  private userId: string;
  private roleName: string;
  private roleId: string;

  constructor(username: string, password: string, jwtAccessToken: string, refreshToken: string, userId: string,  roleName: string, roleId: string) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.jwtAccessToken = jwtAccessToken;
    this.refreshToken = refreshToken;
    this.roleName = roleName;
    this.roleId = roleId;
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getJwtAccessToken(): string {
    return this.jwtAccessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getUserId(): string {
    return this.userId;
  }

  getRoleName(): string {
    return this.roleName;
  }

  getRoleId(): string {
    return this.roleId;
  }

  
}
