import { icon } from "../icon.js";
// Solid from Phosphor Icons "arrow-up-right" fill (MIT, Copyright (c) 2023 Phosphor Icons).
export const ArrowUpRight = icon("ArrowUpRight", "arrow-up-right", {
    nodes: [
        ["path", { d: "M7 7h10v10" }, { r: "shoot", x: 1, y: -1, a: 5, o: [12, 12] }],
        ["path", { d: "M7 17 17 7" }, { r: "shoot", x: 1, y: -1, a: 5, o: [12, 12] }],
    ],
    solid: [
        [
            "path",
            {
                d: "M18.75 6V15.75a0.75 0.75 0 0 1-1.281 0.531L13.125 11.935 6.531 18.531a0.75 0.75 0 0 1-1.061-1.061L12.065 10.875 7.719 6.531A0.75 0.75 0 0 1 8.25 5.25H18A0.75 0.75 0 0 1 18.75 6Z",
                stroke: "none",
            },
            { r: "shoot", x: 1, y: -1, a: 5, o: [12, 12] },
        ],
    ],
});
