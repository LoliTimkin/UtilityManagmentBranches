//const { Gitlab } = require('@gitbeaker/node');
//const { gitlabConnect } = require('./config');
import { Gitlab } from '@gitbeaker/node';
import { gitlabConnect } from './config.js';

// Создаем клиент GitLab
const api = new Gitlab(gitlabConnect);

// ID или путь до вашего проекта
//const projectId = 'perspect/filer/devops/scripts'; // ID или путь до проекта
const projectId = process.argv[2]; // id или путь до проекта

// Имя ветки для тегирования
const refBranch = 'master';

// Имя тега
//const tagName = 'v1.1.0'; // Имя тега
const tagName = process.argv[3]; // Например: node script.js perspect/filer/devops/scripts v1.0.0
const tagMessage = `Release ${tagName}`; // Сообщение тега

async function createTag() {
    try {
        // Создание тега
        const tag = await api.Tags.create(projectId,
            tagName, // Имя тега
            refBranch, // Ветка или хэш коммита
            {
                message: tagMessage // Описание тега
            }
        );

        console.log('Тег успешно создан:', tag);
    } catch (error) {
        console.error('Ошибка при создании тега:', error);
    }
}

// Запуск создания тега
createTag();
