class User {
  id?: string;

  name: string;

  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

export default User;
