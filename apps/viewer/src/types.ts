type UUID = string;

export interface DomMeta {
	parentTagName: string;
	parentIndex: number;
	textOffset: number;
}

export interface SerializedHighlight {
	id: UUID;
	start: DomMeta;
	end: DomMeta;
	text: string;
}
