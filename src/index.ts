import { ConnectionOptions, createConnection } from "typeorm"
import { User } from "./entity/user"
import { UsersObject } from "./entity/usersObject"

const options: ConnectionOptions = {
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "root",
  database: `default-manymany`,
  entities: [ User, UsersObject ],
  logging: true,
  synchronize: true
}

async function main () {
  const connection = await createConnection(options);
  const objectRepo = connection.getRepository(UsersObject);
  const userRepo= connection.getRepository(User);

  // UUIDs samples
  const userId = Buffer.from([135,114,221,160,230,218,17,234,175,15,4,237,51,12,208,0]);

  const objectId = 1;

  // Clear tables
  await objectRepo.createQueryBuilder("User").delete().execute();
  await userRepo.createQueryBuilder("object").delete().execute();

  // Inserting user, works fine
  
  const user: User = {
    id: userId,
    name: "user1",
    objects: []
  }


  await userRepo.save(user);

  // Inserting object : works fine

  const object: UsersObject = {
    id: objectId
  };

  console.log("1")
  
  console.log(await objectRepo.createQueryBuilder()
  .select()
  .where("id = :id", { id: objectId })
  .getOne());
  
  console.log("2")

  // Updating user.objects
  // Fails on save: tries to insert (default, object.id)  instead (user.id, object.id)

  user.objects = [object];
  await userRepo.save(user);

  console.log(await userRepo.createQueryBuilder("User")
  .leftJoinAndMapMany("User.objects", "User.objects", "objects")
  .getMany());
  
}

main().catch(console.error)
