from flask import Flask, request, jsonify
import openai
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# defining app route


@app.route('/listRespo', methods=['GET', 'POST'])
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
            'result': repo_names
        }

        return jsonify(response)
    else:
        return jsonify({'error': 'Missing input data'}), 400


if __name__ == '__main__':
    app.run(debug=True)
