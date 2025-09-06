//const { Gitlab } = require('@gitbeaker/node');
//const { gitlabConnect} = require("./config");
import { Gitlab } from '@gitbeaker/node';
import { gitlabConnect } from './config.js';

// Создаем клиент GitLab
const api = new Gitlab(gitlabConnect);

// ID или путь до вашего проекта
// const projectId = 'perspect/filer/devops/scripts'; // Id или путь до проекта
const projectId = process.argv[2]; // id или путь до проекта
//const newBranchName = 'releases/20250225';
const newBranchName = process.argv[3]; // Имя новой релизной ветки, передается аргументом
const sourceBranch = 'dev'; // Ветка, от которой создается новая ветка

async function manageBranches() {
    try {
        // Создание новой ветки
        const newBranch = await api.Branches.create(projectId, newBranchName, sourceBranch);
        console.log('Новая ветка создана:', newBranch);

        // Получение списка веток
        const branches = await api.Branches.all(projectId);
        console.log('Список веток:', branches);

    } catch (error) {
        throw error;
    }
}


manageBranches().catch(error => {
    console.error("Произошла ошибка", error);
    process.exit(1);
});


