import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Property } from "./Property.entity";

@Entity({
  name: "property_search",
})
export class PropertySearch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  search_query: string;

  @Column()
  state: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Property, (property) => property.property_search)
  properties: Property[];
}
