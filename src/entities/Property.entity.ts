import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertySearch } from "./Property_Search.entity";

@Entity()
export class Property {
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

  @Column()
  country: string;

  @Column()
  zip: string;

  @Column()
  phone: string;

  @Column()
  type: string;

  @Column()
  capacity: number;

  @Column()
  images: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  property_search_id: number;

  @ManyToOne(
    () => PropertySearch,
    (property_search) => property_search.properties
  )
  @JoinColumn({ name: "property_search_id" })
  property_search: PropertySearch;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
