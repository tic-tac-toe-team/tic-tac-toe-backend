export class PlayerResponseDto {
  id: number;
  username: string;
  access_token: string;

  constructor(id: number, username: string, access_token?: string) {
    this.id = id;
    this.username = username;
    this.access_token = access_token;
  }
}
