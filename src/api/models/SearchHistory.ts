import { IsNotEmpty } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SearchHistory {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public username: string;

    @IsNotEmpty()
    @Column({ name: 'search_term' })
    public searchTerm: string;

    @Column({ name: 'result_count' })
    public resultCount: number;

    @CreateDateColumn({ name: 'created_at' })
    public createdAt: Date;

}
