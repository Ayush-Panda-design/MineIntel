export type ElementType = 'TEXT' | 'IMAGE' | 'SHAPE' | 'LINE' | 'ARROW' | 'DIAGRAM' | 'TABLE' | 'CHART' | 'GROUP';

export type Role = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: Role;
  isOnline: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  resolved: boolean;
  targetId: string; // slideId or elementId
  replies?: Comment[];
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity?: number;
  locked?: boolean;
  groupId?: string;
  name?: string;
}

export interface TextElement extends BaseElement {
  type: 'TEXT';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  color: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'SHAPE';
  shapeType: 'rect' | 'circle' | 'triangle' | 'rounded-rect';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius?: number;
}

export interface ImageElement extends BaseElement {
  type: 'IMAGE';
  url: string;
  assetId?: string;
  crop?: { x: number, y: number, width: number, height: number };
}

export type SlideElement = TextElement | ShapeElement | ImageElement;

export interface Slide {
  id: string;
  presentationId?: string;
  order?: number;
  title: string;
  elements: SlideElement[];
  background?: string;
  status: 'draft' | 'in-progress' | 'done' | 'not-started';
  assignedTo?: string; // User ID
  lockedBy?: string; // User ID (for live collaboration)
  isEditing?: boolean;
  lastEditedAt?: string;
  speakerNotes?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'vector';
  source: 'ai_generated' | 'uploaded' | 'mineintel';
  prompt?: string;
  createdBy: string;
  createdAt: string;
  thumbnail: string;
  fullAsset: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface Presentation {
  id: string;
  name: string;
  team: User[];
  comments: Comment[];
  slides: Slide[];
  assets?: Asset[];
}
