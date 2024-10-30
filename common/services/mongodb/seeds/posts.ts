import type { Post } from '../../../../posts/types/posts';

const getPostsSeeds: () => Post[] = () => [
  {
    _id: 'post_id1',
    text: "Zephyr's eyes glimmered with mischievous curiosity as he ventured into the enchanted forest, where whispers of ancient secrets danced among the rustling leaves. The air was alive with a symphony of mystical creatures, their ethereal melodies blending with the soft breeze.",
    date: new Date(),
    authorId: 'user_id3',
  },
  {
    _id: 'post_id2',
    text: 'As he walked, Zephyr stumbled upon a hidden clearing, bathed in golden sunlight that filtered through the canopy above. In the heart of the clearing stood a magnificent waterfall, cascading down with a melodious rush.',
    date: new Date(),
    authorId: 'user_id4',
  },
  {
    _id: 'post_id3',
    text: 'Lost in the enchantment of the moment, Zephyr noticed a peculiar creature perched on a mossy rock nearby.',
    date: new Date(),
    authorId: 'user_id1',
  },
];

export { getPostsSeeds };
