export interface DomMeta {
	parentTagName: string;
	parentIndex: number;
	textOffset: number;
}

export interface SerializedHighlight {
	id: string;
	start: DomMeta;
	end: DomMeta;
	text: string;
}
