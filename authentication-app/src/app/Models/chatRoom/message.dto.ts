import { UserDTO } from "../auth/user.dto";

export class MessageDTO {
    id!: string;
    content!: string;
    timestamp!: Date;
    sender!: UserDTO;
}