import { applyVueInReact } from 'veaury';
import { VueCal, addDatePrototypes } from 'vue-cal';
import 'vue-cal/style';
import { ComponentType } from 'react';

// Add date prototypes for easier date manipulation
addDatePrototypes();

const VueCalWrapper = applyVueInReact(VueCal) as ComponentType<any>;

export default VueCalWrapper; 