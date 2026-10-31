from pydriller import Repository

repo_url = "https://github.com/pallets/flask"

for commit in Repository(repo_url).traverse_commits():
    print("Commit:", commit.hash)
    print("Author:", commit.author.name)
    print("Message:", commit.msg)
    print("-" * 50)