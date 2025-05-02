import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma:PrismaService){}
  async create(data: CreateRegionDto) {
    try {
      let newRegion = await this.prisma.region.create({data})
      return newRegion
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(name?: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
  
      const regions = await this.prisma.region.findMany({
        where: name ? { name: { contains: name, mode: 'insensitive' } } : undefined,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      });
  
      const total = await this.prisma.region.count({
        where: name ? { name: { contains: name, mode: 'insensitive' } } : undefined,
      });
  
      return {
        data: regions,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message);
    }
  }
  

  async findOne(id: string) {
    try {
      let region = await this.prisma.region.findFirst({where:{id}})
      if(!region){
        throw new NotFoundException("Region not found")
      }
      return region
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      let region = await this.prisma.region.update({where:{id},data})
      if(!region){
        throw new NotFoundException("Region not found")
      }
      return region
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      this.findOne(id)
      let region = await this.prisma.region.findFirst({where:{id}})
      return region
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
