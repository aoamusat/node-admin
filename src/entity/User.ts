import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@ManyToOne(() => Role)
	@JoinColumn({ name: "role_id" })
	role: Role;
}
