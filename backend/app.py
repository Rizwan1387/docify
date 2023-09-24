from flask import Flask, request, jsonify
import openai
import requests
from flask_cors import CORS
import os
openai.api_key = os.getenv("OPENAI_API_KEY")
app = Flask(__name__)
CORS(app)

# defining app route
global username
global token


@app.route('/repos', methods=['GET', 'POST'])
def listRespo():
    data = request.get_json()
    if 'username' in data and 'token' in data:
        username = data['username']
        token = data['token']
        repositories = []

        # API endpoint for fetching user repositories
        url = f'https://api.github.com/users/{username}/repos'
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }

        res = requests.get(url, headers=headers)

        if res.status_code == 200:
            result = res.json()

        repo_names = [repo['name'] for repo in result]

        response = {
            'result': repo_names,
            'username': username,
            'token': token
        }

        return jsonify(response)
    else:
        return jsonify({'error': 'Missing input data'}), 400


@app.route('/aidocs', methods=['POST'])
def repofiles():
    data = request.get_json()
    if 'username' in data and 'token' in data:
        username = data['username']
        token = data['token']
        path = data['path']
        repo = data['repo']

    def fetch_file_urls(username, repo, path, token):
        file_urls = []
        skip_files = ['node_modules', 'package-lock.json']
        # API endpoint for fetching the contents of a directory
        url = f'https://api.github.com/repos/{username}/{repo}/contents/{path}'
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            contents = response.json()

            for content in contents:
                if content['type'] == 'file':
                    # Check if the file name should be skipped
                    file_name = content['name'].lower()
                    if file_name in skip_files:
                        continue

                    # If it's a file, add its name, URL, and path to the list
                    file_urls.append({
                        'name': content['name'],
                        'html_url': content['html_url'],
                        'path': content['path']
                    })
                elif content['type'] == 'dir':
                    if content['type'] in skip_files:
                        print("skipped", content['type'])
                        continue
                        # If it's a directory, recursively fetch file URLs
                    else:
                        sub_path = path + '/' + \
                            content['name'] if path else content['name']
                        sub_urls = fetch_file_urls(
                            username, repo, sub_path, token)
                        file_urls.extend(sub_urls)
        return file_urls
    file_urls = fetch_file_urls(username, repo, path, token)
    pathandcode = []
    for repofile in file_urls:
        filedict = {}
        repopath = repofile['path']
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }

        repocode = requests.get(
            f'https://raw.githubusercontent.com/{username}/{repo}/main/{repopath}', headers=headers)
        repocode = repocode.text
        filedict['path'] = repopath
        filedict["code"] = repocode
        docresponse = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            messages=[
                  {"role": "system",
                   "content": f'you are a senior software developer expert in writing tecnical documentation , given code file and path of the file , return the documentation for new members on the team,the path of file is : {repopath} and the file content is {repocode}'
                   }
            ],)
        documentation = docresponse['choices'][0]['message']['content']
        filedict['documentation'] = documentation
        pathandcode.append(filedict)
    return jsonify(pathandcode)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
