//const { Gitlab } = require('@gitbeaker/node');
//const { gitlabConnect} = require("./config");
import { Gitlab } from '@gitbeaker/node';
import { gitlabConnect } from './config.js';

// Создаем клиент GitLab
const api = new Gitlab(gitlabConnect);

// ID или путь до вашего проекта
// const projectId = 'perspect/filer/devops/scripts'; // id или путь до проекта
//const sourceBranch = 'releases/20250109'; // Ветка, которую будем сливать
const projectId = process.argv[2]; // id или путь до проекта
const releaseBranch = process.argv[3]; // Ветка, которую будем сливать, релиз
const masterBranch = 'master'; // Ветка, в которую будем сливать
const devBranch = 'dev'; // Ветка, в которую будем сливать master

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function mergeBranches(sourceBranch, targetBranch) {
    try {

        const title= `Merge ${sourceBranch} into ${targetBranch}` // Заголовок MR

// Создание запроса на слияние
        const mergeRequest = await api.MergeRequests.create(projectId,
            sourceBranch,
            targetBranch,
            title,
            {
                removeSourceBranch: false, // Удалить ли исходную ветку после слияния
                squash: true  // Объединить коммиты в один (если нужно)
            })

        console.log('Merge Request создан:', mergeRequest.web_url);
        console.log('Merge Request создан:', mergeRequest.iid);

        await delay(10000);

        const mrStatus = await api.MergeRequests.show(projectId, mergeRequest.iid);
        console.log('Статус Merge Request:', mrStatus);

        // Применение слияния автоматически (если GitLab настроен на автоматическое выполнение MR)
        if(!mrStatus.has_conflicts) {
            const mergeResult = await api.MergeRequests.accept(
                projectId,
                mergeRequest.iid, // Внутренний ID MR (IID)
                {
                    mergeCommitMessage: `Merge ${sourceBranch} into ${targetBranch}`,
                    squash: true, // Объединить коммиты (опционально)
                }
            );

            console.log('Слияние выполнено:', mergeResult);

        } else {
            //console.log('Слияние не выполнено, есть конфликты');
            throw new Error('Слияние не выполнено, есть конфликты')
        }

    } catch (error) {
        console.error('Ошибка при слиянии веток:', error);
        throw error
    }
}

async function merging() {
    try {
        await mergeBranches(releaseBranch, masterBranch);
        await mergeBranches(masterBranch, devBranch)
    } catch (error) {
        console.error("Произошла ошибка", error)
    }
}

merging()
