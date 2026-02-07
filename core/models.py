from django.db import models

class Library(models.Model):
    library_id = models.AutoField(primary_key=True)
    # Adding a name field so the library isn't just an ID
    name = models.CharField(max_length=100) 

class Author(models.Model):
    author_id = models.AutoField(primary_key=True)
    author_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    gender = models.CharField(max_length=10)

class Book(models.Model):
    book_id = models.AutoField(primary_key=True)
    book_name = models.CharField(max_length=255)
    date_published = models.DateField()
    author_id = models.ForeignKey(Author, on_delete=models.CASCADE)
    library_id = models.ForeignKey(Library, on_delete=models.CASCADE)

class Member(models.Model):
    member_id = models.AutoField(primary_key=True)
    book_id = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    member_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    gender = models.CharField(max_length=10)
    birthyear = models.IntegerField()