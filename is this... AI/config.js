let placeholder = "media/placeholder.svg";

let config = {
    // Ordre de passage : une ligne par personne, une colonne par tour.
    // Le chiffre = le media que la personne voit à ce tour-là.
    order: [
       //T1 T2 T3 T4 T5 T6
        [1, 2, 3, 4, 5, 6], // Personne 1
        [2, 3, 4, 5, 6, 1], // Personne 2
        [3, 4, 5, 6, 1, 2], // Personne 3
        [4, 5, 6, 1, 2, 3], // Personne 4
        [5, 6, 1, 2, 3, 4], // Personne 5
        [6, 1, 2, 3, 4, 5], // Personne 6
    ],

    datasets: [
        {
            label: "A", /* 100% Human */
            items: [
                { type: "Photo",   answer: "human", src: "/media/A/humanImage1.png" },
                { type: "Photo",   answer: "human", src: "/media/A/humanImage2.png" },
                { type: "Video",   answer: "human", src: "/media/A/humanVideo1.mov" },
                { type: "Video",   answer: "human", src: "/media/A/humanVideo2.mp4" },
                { type: "Article", answer: "human", src: "/media/A/humanArticle1.png" },
                { type: "Article", answer: "human", src: "/media/A/humanArticle2.png" },
            ],
        },
        {
            label: "B", /* 100% AI */
            items: [
                { type: "Photo",   answer: "ai", src: "/media/B/aiImage1.jpg" },
                { type: "Photo",   answer: "ai", src: "/media/B/aiImage2.png" },
                { type: "Video",   answer: "ai", src: "/media/B/aiVideo1.mp4" },
                { type: "Video",   answer: "ai", src: "/media/B/aiVideo2.mov" },
                { type: "Article", answer: "ai", src: "/media/B/aiArticle1.png" },
                { type: "Article", answer: "ai", src: "/media/B/aiArticle2.png" },
            ],
        },
        {
            label: "C", /* 50% AI / 50% human */
            items: [
                { type: "Photo",   answer: "ai",    src: "/media/C/aiImage3.png" },
                { type: "Photo",   answer: "human", src: "/media/C/humanImage3.png" },
                { type: "Video",   answer: "ai",    src: "/media/C/aiVideo3.mov" },
                { type: "Video",   answer: "human", src: "/media/C/humanVideo3.mov" },
                { type: "Article", answer: "ai",    src: "/media/C/aiArticle3.png" },
                { type: "Article", answer: "human", src: "/media/C/humanArticle3.png" },
            ],
        },
    ],
};
