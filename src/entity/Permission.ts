import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "permission" })
export class Permission {
	@PrimaryGeneratedColumn()
	id: Number;

	@Column()
	name: string;
}
