import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({
    nullable: true,
  })
  country?: string;

  @Column()
  zip: string;

  @Column({
    unique: true,
    nullable: true,
  })
  phone?: string;

  @Column({
    nullable: true,
  })
  link?: string;

  @Column()
  type: string;

  isSaved?: boolean;

  @Column({
    nullable: true,
  })
  capacity?: number;

  @Column({
    nullable: true,
  })
  code?: number;

  @Column({
    type: "text",
    nullable: true,
  })
  images: string;

  @Column({
    type: "float",
    nullable: true,
  })
  latitude: number;

  @Column({
    type: "float",
    nullable: true,
  })
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
