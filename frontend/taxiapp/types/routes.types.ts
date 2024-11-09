type MapBoxRoute = {
    start: string;
    end: string
    distance: number;
    geometry: {
        coordinates: [number, number][];
    };
}

export type { MapBoxRoute };
