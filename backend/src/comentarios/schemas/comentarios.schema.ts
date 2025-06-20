import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'comentarios' })
export class Comentario extends Document {
  @Prop({ required: true })
  mensaje!: string;

  @Prop()
  imagenUrl?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  autor!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
  publicacion!: Types.ObjectId;

  @Prop({ default: false })
  modificado!: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
