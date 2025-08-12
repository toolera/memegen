import { MemeTemplate } from '@/types/meme';

export const POPULAR_MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Pointing',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    width: 1200,
    height: 1200,
    box_count: 2
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    width: 1200,
    height: 800,
    box_count: 3
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    width: 600,
    height: 908,
    box_count: 3
  },
  {
    id: 'mocking-spongebob',
    name: 'Mocking SpongeBob',
    url: 'https://i.imgflip.com/1otk96.jpg',
    width: 502,
    height: 353,
    box_count: 2
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg',
    width: 482,
    height: 361,
    box_count: 2
  },
  {
    id: 'woman-yelling-at-cat',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg',
    width: 680,
    height: 438,
    box_count: 2
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jwhww.jpg',
    width: 857,
    height: 1202,
    box_count: 4
  },
  {
    id: 'this-is-fine',
    name: 'This is Fine',
    url: 'https://i.imgflip.com/26am.jpg',
    width: 580,
    height: 282,
    box_count: 2
  }
];

export const getDefaultTextBoxes = (template: MemeTemplate) => {
  const defaultBoxes = [];
  
  switch (template.id) {
    case 'drake':
      return [
        {
          text: 'NO TO THIS',
          x: template.width * 0.75,
          y: template.height * 0.25,
          width: template.width * 0.4,
          height: template.height * 0.2,
          fontSize: Math.max(32, template.width / 15),
          color: '#FFFFFF',
          fontFamily: 'Impact',
          textAlign: 'center' as const
        },
        {
          text: 'YES TO THIS',
          x: template.width * 0.75,
          y: template.height * 0.75,
          width: template.width * 0.4,
          height: template.height * 0.2,
          fontSize: Math.max(32, template.width / 15),
          color: '#FFFFFF',
          fontFamily: 'Impact',
          textAlign: 'center' as const
        }
      ];
    
    case 'distracted-boyfriend':
      return [
        {
          text: 'ME',
          x: template.width * 0.5,
          y: template.height * 0.15,
          width: template.width * 0.2,
          height: template.height * 0.1,
          fontSize: Math.max(24, template.width / 20),
          color: '#FFFFFF',
          fontFamily: 'Impact',
          textAlign: 'center' as const
        },
        {
          text: 'OLD THING',
          x: template.width * 0.15,
          y: template.height * 0.15,
          width: template.width * 0.25,
          height: template.height * 0.1,
          fontSize: Math.max(20, template.width / 25),
          color: '#FFFFFF',
          fontFamily: 'Impact',
          textAlign: 'center' as const
        },
        {
          text: 'NEW THING',
          x: template.width * 0.85,
          y: template.height * 0.15,
          width: template.width * 0.25,
          height: template.height * 0.1,
          fontSize: Math.max(20, template.width / 25),
          color: '#FFFFFF',
          fontFamily: 'Impact',
          textAlign: 'center' as const
        }
      ];
    
    default:
      for (let i = 0; i < template.box_count; i++) {
        const isTopText = i === 0;
        const isBottomText = i === template.box_count - 1 && template.box_count === 2;
        
        defaultBoxes.push({
          text: isTopText ? 'TOP TEXT' : isBottomText ? 'BOTTOM TEXT' : `TEXT ${i + 1}`,
          x: template.width * 0.5,
          y: isTopText ? template.height * 0.15 : 
              isBottomText ? template.height * 0.85 :
              (template.height / (template.box_count + 1)) * (i + 1),
          width: template.width * 0.9,
          height: template.height * 0.15,
          fontSize: Math.max(24, Math.min(48, template.width / 15)),
          color: '#FFFFFF',
          fontFamily: 'Impact',
          textAlign: 'center' as const
        });
      }
      return defaultBoxes;
  }
};