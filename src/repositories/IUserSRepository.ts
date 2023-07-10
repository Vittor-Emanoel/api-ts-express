interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IUsersRepository {
  findByEmail(email: string): Promise<User>;
  save(User: User): Promise<void>;
}
