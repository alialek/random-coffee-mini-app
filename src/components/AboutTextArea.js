import React from 'react';
import { FormLayout, Textarea } from '@vkontakte/vkui';

const AboutTextArea = ({ setAbout }) => {
	return (
		<FormLayout className="slide__form">
			<Textarea
				onInput={(e) => setAbout(e.target.value)}
				top="О себе"
				placeholder="Здесь ты можешь оставить любую информацию о себе, которая будет полезна участникам"
			/>
		</FormLayout>
	);
};

export default AboutTextArea;
