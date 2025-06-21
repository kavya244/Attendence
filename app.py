from flask import Flask, render_template, request, redirect
from datetime import datetime
import csv
import os

app = Flask(__name__)

# Route: Home Page (Attendance Form)
@app.route('/')
def index():
    return render_template('index.html')

# Route: Form Submission
@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
    roll = request.form['roll']
    date = datetime.now().strftime('%Y-%m-%d')
    time = datetime.now().strftime('%H:%M:%S')

    file_exists = os.path.isfile('attendance.csv')

    with open('attendance.csv', 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Name', 'Roll', 'Date', 'Time'])  # Header if file is new
        writer.writerow([name, roll, date, time])

    return redirect('/success')

# Route: Success Page
@app.route('/success')
def success():
    return render_template('success.html')

# Run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)  # Use port 10000 for compatibility with Render
